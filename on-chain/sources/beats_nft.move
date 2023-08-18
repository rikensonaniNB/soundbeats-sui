module soundbeats::beats_nft {
    use sui::url::{Self, Url};
    use std::string;
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    
    /// Error types 
    const EBadWitness: u64 = 0;

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
    
    /// Denotes the owner of the NFT proper (not a specific instance)
    struct BeatsOwnerCap<phantom T> has key, store {
        id: UID
    }
    
    /// The OTW (one-time witness)
    struct BEATS_NFT has drop { }

    /// One-time init with witness
    fun init(witness: BEATS_NFT, ctx: &mut TxContext) {
        assert!(sui::types::is_one_time_witness(&witness), EBadWitness);
        
        let coreData = BeatsOwnerCap<BEATS_NFT> {
            id: object::new(ctx)
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
    
    /// Mints a single NFT instance 
    public fun internal_mint(
        _ownerCap: &mut BeatsOwnerCap<BEATS_NFT>,
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ): BeatsNft<BEATS_NFT> {
        
        //ensure owner is sender 
        let sender = tx_context::sender(ctx);
        
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
        
        //return nft 
        nft
    }

    // ===== Entrypoints =====
    
    /**
     * Mints multiple or single instances of NFT to recipient. 
     * Restricted to NFT owner. 
     *
     * @param ownerCap: BeatsOwnerCap object owned by caller
     * @param name: NFT name string 
     * @param description: NFT description string 
     * @param url: NFT image url
     * @param recipient: Intended recipient address of new minted NFT
     * @param quantity: Quantity to mint 
     * @param ctx: Context
     */
    public entry fun mint(
        ownerCap: &mut BeatsOwnerCap<BEATS_NFT>,
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        recipient: address,
        quantity: u32,
        ctx: &mut TxContext
    ) {
        let i = 0;
        while (i < quantity) {
            let nft = internal_mint(ownerCap, name, description, url, ctx); 

            transfer::public_transfer(nft, recipient);
            i = i + 1;
        };
    }
    
    /**
     * Transfers ownership to another address. 
     * Restricted to current NFT owner. 
     *
     * @param ownerCap: BeatsOwnerCap object owned by caller
     * @param new_owner: Address to which to transfer ownership
     * @param ctx: Context
     */
    public entry fun transfer_owner(
        ownerCap: BeatsOwnerCap<BEATS_NFT>,
        new_owner: address
    ) {
        //transfer ownership to owner 
        transfer::public_transfer(ownerCap, new_owner)
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