module soundbeats::beats_nft {
    use sui::url::{Self, Url};
    use std::string;
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    /// Error types 
    const EBadWitness: u64 = 0;
    const ENotOwner: u64 = 3;

    // ===== Init & Witness =====
    
    /// Core NFT struct
    struct BeatsNft<phantom T> has key, store {
        id: UID,
        /// Name for the token
        name: string::String,
        /// Description of the token
        description: string::String,
        /// URL for the token
        url: Url
    }
    
    struct BeatsOwnerCap<phantom T> has key, store {
        id: UID, 
        owner: address
    }
    
    /// The OTW (one-time witness)
    struct BEATS_NFT has drop { }

    /// One-time init with witness
    fun init(witness: BEATS_NFT, ctx: &mut TxContext) {
        assert!(sui::types::is_one_time_witness(&witness), EBadWitness);
        
        let coreData = BeatsOwnerCap<BEATS_NFT> {
            id: object::new(ctx),
            owner: tx_context::sender(ctx)
        };
        
        //transfer ownership to owner 
        transfer::public_transfer(coreData, tx_context::sender(ctx))
    }

    // ===== Events =====

    struct NFTMinted has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The creator of the NFT
        creator: address,
        // The name of the NFT
        name: string::String,
    }

    // ===== Public view functions =====

    /// Get the NFT's `name`
    public fun name(nft: &BeatsNft<BEATS_NFT>): &string::String {
        &nft.name
    }

    /// Get the NFT's `description`
    public fun description(nft: &BeatsNft<BEATS_NFT>): &string::String {
        &nft.description
    }

    /// Get the NFT's `url`
    public fun url(nft: &BeatsNft<BEATS_NFT>): &Url {
        &nft.url
    }
    
    public fun internal_mint(
        beats: &mut BeatsOwnerCap<BEATS_NFT>,
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ): BeatsNft<BEATS_NFT> {
        
        //ensure owner is sender 
        let sender = tx_context::sender(ctx);
        assert!(beats.owner == sender, ENotOwner);
        
        let nft = BeatsNft<BEATS_NFT> {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url)
        };

        event::emit(NFTMinted {
            object_id: object::id(&nft),
            creator: sender,
            name: nft.name,
        });
        
        nft
    }

    // ===== Entrypoints =====
    
    /// Create a new soundbeats_nft
    public entry fun mint(
        beats: &mut BeatsOwnerCap<BEATS_NFT>,
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        recipient: address,
        quantity: u32,
        ctx: &mut TxContext
    ) {
        
        //ensure owner is sender 
        let sender = tx_context::sender(ctx);
        assert!(beats.owner == sender, ENotOwner);
        
        let i = 0;
        while (i < quantity) {
            let nft = internal_mint(beats, name, description, url, ctx); 

            transfer::public_transfer(nft, recipient);
            i = i + 1;
        };
    }
    // ===== Tests =====
    
    #[test]
    public fun test_owner_abilities() {
        use sui::test_scenario;

        // create test addresses representing users
        let admin = @0xBABE;
        let recipient = @0xCAFE;
        
        //initialize the core nft 
        let scenario_val = test_scenario::begin(admin);
        let scenario = scenario_val;
        {
            let witness = BEATS_NFT{};
            init(witness, test_scenario::ctx(&mut scenario));
        };
        
        //admin can mint an instance
        test_scenario::next_tx(&mut scenario, admin); 
        {
            let name = b"za";
            let desc = b"az";
            let url = b"zz";
            let beats = test_scenario::take_from_sender<BeatsOwnerCap<BEATS_NFT>>(&scenario);
            mint(&mut beats, name, desc, url, recipient, 1, test_scenario::ctx(&mut scenario));
            test_scenario::return_to_address<BeatsOwnerCap<BEATS_NFT>>(admin, beats);
        };
        
        //admin can mint instance to self
        test_scenario::next_tx(&mut scenario, admin); 
        {
            let name = b"za";
            let desc = b"az";
            let url = b"zz";
            let beats = test_scenario::take_from_sender<BeatsOwnerCap<BEATS_NFT>>(&scenario);
            mint(&mut beats, name, desc, url, admin, 1, test_scenario::ctx(&mut scenario));
            test_scenario::return_to_address<BeatsOwnerCap<BEATS_NFT>>(admin, beats);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test, expected_failure]
    public fun test_non_owner_restrictions() {
        use sui::test_scenario;

        // create test addresses representing users
        let admin = @0xBABE;
        let recipient = @0xCAFE;
        
        //initialize the core nft 
        let scenario_val = test_scenario::begin(admin);
        let scenario = scenario_val;
        {
            let witness = BEATS_NFT{};
            init(witness, test_scenario::ctx(&mut scenario));
        };
        
        //non-admin cannot mint 
        test_scenario::next_tx(&mut scenario, recipient); 
        {
            let name = b"za";
            let desc = b"az";
            let url = b"zz";
            let beats = test_scenario::take_from_sender<BeatsOwnerCap<BEATS_NFT>>(&scenario);
            mint(&mut beats, name, desc, url, recipient, 1, test_scenario::ctx(&mut scenario));
            test_scenario::return_to_address<BeatsOwnerCap<BEATS_NFT>>(recipient, beats);
        };
        
        test_scenario::end(scenario);
    }
}