module soundbeats::beatmaps_nft {
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
    struct BeatmapsNft<phantom T> has key, store {
        id: UID,
        /// metadata for the token
        metadata: string::String,
        /// URL for the token
        url: Url
    }
    
    /// Denotes the owner of the NFT proper (not a specific instance)
    struct BeatmapsOwnerCap<phantom T> has key, store {
        id: UID
    }
    
    /// The OTW (one-time witness)
    struct BEATMAPS_NFT has drop { }

    /// One-time init with witness
    fun init(witness: BEATMAPS_NFT, ctx: &mut TxContext) {
        assert!(sui::types::is_one_time_witness(&witness), EBadWitness);
        
        let coreData = BeatmapsOwnerCap<BEATMAPS_NFT> {
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
        creator: address
    }

    // ===== Public view functions =====

    /// Get the NFT's `metadata`
    public fun metadata(nft: &BeatmapsNft<BEATMAPS_NFT>): &string::String {
        &nft.metadata
    }

    /// Get the NFT's `url`
    public fun url(nft: &BeatmapsNft<BEATMAPS_NFT>): &Url {
        &nft.url
    }
    
    /// Mints a single NFT instance 
    public fun internal_mint(
        _ownerCap: &mut BeatmapsOwnerCap<BEATMAPS_NFT>,
        metadata: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ): BeatmapsNft<BEATMAPS_NFT> {
        
        //ensure owner is sender 
        let sender = tx_context::sender(ctx);
        
        let nft = BeatmapsNft<BEATMAPS_NFT> {
            id: object::new(ctx),
            metadata: string::utf8(metadata),
            url: url::new_unsafe_from_bytes(url)
        };

        event::emit(NFTMinted {
            object_id: object::id(&nft),
            creator: sender
        });
        
        //return nft 
        nft
    }

    // ===== Entrypoints =====
    
    /**
     * Mints multiple or single instances of NFT to recipient. 
     * Restricted to NFT owner. 
     *
     * @param ownerCap: BeatmapsOwnerCap object owned by caller
     * @param metadata: NFT metadata string 
     * @param url: NFT image url
     * @param recipient: Intended recipient address of new minted NFT
     * @param quantity: Quantity to mint 
     * @param ctx: Context
     */
    public entry fun mint(
        ownerCap: &mut BeatmapsOwnerCap<BEATMAPS_NFT>,
        metadata: vector<u8>,
        url: vector<u8>,
        recipient: address,
        quantity: u32,
        ctx: &mut TxContext
    ) {
        let i = 0;
        while (i < quantity) {
            let nft = internal_mint(ownerCap, metadata, url, ctx); 

            transfer::public_transfer(nft, recipient);
            i = i + 1;
        };
    }
    
    /**
     * Transfers ownership to another address. 
     * Restricted to current NFT owner. 
     *
     * @param ownerCap: BeatmapsOwnerCap object owned by caller
     * @param new_owner: Address to which to transfer ownership
     * @param ctx: Context
     */
    public entry fun transfer_owner(
        ownerCap: BeatmapsOwnerCap<BEATMAPS_NFT>,
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
            let witness = BEATMAPS_NFT{};
            init(witness, test_scenario::ctx(&mut scenario));
        };
        
        //admin can mint an instance
        test_scenario::next_tx(&mut scenario, admin); 
        {
            let metadata = b"za";
            let url = b"zz";
            let beats = test_scenario::take_from_sender<BeatmapsOwnerCap<BEATMAPS_NFT>>(&scenario);
            mint(&mut beats, name, url, recipient, 1, test_scenario::ctx(&mut scenario));
            test_scenario::return_to_address<BeatmapsOwnerCap<BEATMAPS_NFT>>(admin, beats);
        };
        
        //admin can mint instance to self
        test_scenario::next_tx(&mut scenario, admin); 
        {
            let metadata = b"za";
            let url = b"zz";
            let beats = test_scenario::take_from_sender<BeatmapsOwnerCap<BEATMAPS_NFT>>(&scenario);
            mint(&mut beats, name, url, admin, 1, test_scenario::ctx(&mut scenario));
            test_scenario::return_to_address<BeatmapsOwnerCap<BEATMAPS_NFT>>(admin, beats);
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
            let witness = BEATMAPS_NFT{};
            init(witness, test_scenario::ctx(&mut scenario));
        };
        
        //non-admin cannot mint 
        test_scenario::next_tx(&mut scenario, recipient); 
        {
            let metadata = b"za";
            let url = b"zz";
            let beats = test_scenario::take_from_sender<BeatmapsOwnerCap<BEATMAPS_NFT>>(&scenario);
            mint(&mut beats, name, url, recipient, 1, test_scenario::ctx(&mut scenario));
            test_scenario::return_to_address<BeatmapsOwnerCap<BEATMAPS_NFT>>(recipient, beats);
        };
        
        test_scenario::end(scenario);
    }
}