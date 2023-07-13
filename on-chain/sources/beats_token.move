module soundbeats::beats {
    use std::option;
    use sui::url;
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    // ===== Init & Witness =====
    
    /// The OTW (one-time witness)
    struct BEATS has drop { }

    /// One-time init with witness, creates the Coin object and CoinMetadata. 
    /// Note that the CoinMetadata is shared, but functions to modify it are restriced
    /// to owner.
    fun init(witness: BEATS, ctx: &mut TxContext) {
        // Get a treasury cap for the coin and give it to the transaction sender
        //let foo = option::Option<sui::url> { vec: b"" };
        let (treasury_cap, metadata) = coin::create_currency<BEATS>(
            witness, 
            2, 
            b"BEAT$", 
            b"BEAT$", 
            b"Soundbeats: Gamify Music", 
            option::some(url::new_unsafe_from_bytes(b"http://game.soundbeats.io/beats-icon.png")),
            ctx
        );
        
        //TODO: change this to public share 
        transfer::public_transfer(metadata, tx_context::sender(ctx));
        
        //transfer ownership to owner 
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx))
    }

    // ===== Entrypoints =====
    
    /// Only manager can mint new coins
    public entry fun mint(
        treasury_cap: &mut TreasuryCap<BEATS>, amount: u64, recipient: address, ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury_cap, amount, recipient, ctx);
    }

    /// Only manager can burn coins
    public entry fun burn(treasury_cap: &mut TreasuryCap<BEATS>, coin: Coin<BEATS>) {
        coin::burn(treasury_cap, coin);
    }

    // ===== Tests =====
    
    #[test]
    public fun test_owner_abilities() {
        use sui::test_scenario;

        // create test addresses representing users
        let admin = @0xBABE;
        let recipient = @0xCAFE;
        
        //initialize the token 
        let scenario_val = test_scenario::begin(admin);
        let scenario = scenario_val;
        {
            let witness = BEATS{};
            init(witness, test_scenario::ctx(&mut scenario));
        };
        
        //admin can mint the token 
        test_scenario::next_tx(&mut scenario, admin); 
        {
            let t_cap = test_scenario::take_from_sender<TreasuryCap<BEATS>>(&scenario);
            mint(&mut t_cap, 100, recipient, test_scenario::ctx(&mut scenario));
            test_scenario::return_to_address<TreasuryCap<BEATS>>(admin, t_cap);
        };
        
        //admin can mint to self
        test_scenario::next_tx(&mut scenario, admin); 
        {
            let t_cap = test_scenario::take_from_sender<TreasuryCap<BEATS>>(&scenario);
            mint(&mut t_cap, 1, admin, test_scenario::ctx(&mut scenario));
            test_scenario::return_to_address<TreasuryCap<BEATS>>(admin, t_cap);
        };
        
        //admin can burn
        test_scenario::next_tx(&mut scenario, admin); 
        {
            let coin = test_scenario::take_from_sender<Coin<BEATS>>(&scenario);
            let t_cap = test_scenario::take_from_sender<TreasuryCap<BEATS>>(&mut scenario);
            burn(&mut t_cap, coin);
            test_scenario::return_to_address<TreasuryCap<BEATS>>(admin, t_cap);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    public fun test_update_metadata() {
        use sui::test_scenario;
        use std::string;
        use std::ascii;

        // create test addresses representing users
        let admin = @0xBABE;

        let scenario = test_scenario::begin(admin);
        let test = &mut scenario;
        let ctx = test_scenario::ctx(test);
        let witness = BEATS{};
        let (treasury, metadata) = coin::create_currency(witness, 6, b"COIN_TESTS", b"coin_name", b"description", option::some(url::new_unsafe_from_bytes(b"icon_url")), ctx);

        let decimals = coin::get_decimals(&metadata);
        let symbol_bytes = ascii::as_bytes(&coin::get_symbol<BEATS>(&metadata));
        let name_bytes = string::bytes(&coin::get_name<BEATS>(&metadata));
        let description_bytes = string::bytes(&coin::get_description<BEATS>(&metadata));
        let icon_url = ascii::as_bytes(&url::inner_url(option::borrow(&coin::get_icon_url<BEATS>(&metadata))));

        assert!(decimals == 6, 0);
        assert!(*symbol_bytes == b"COIN_TESTS", 0);
        assert!(*name_bytes == b"coin_name", 0);
        assert!(*description_bytes == b"description", 0);
        assert!(*icon_url == b"icon_url", 0);

        // Update
        coin::update_symbol<BEATS>(&treasury, &mut metadata, ascii::string(b"NEW_COIN_TESTS"));
        coin::update_name<BEATS>(&treasury, &mut metadata, string::utf8(b"new_coin_name"));
        coin::update_description<BEATS>(&treasury, &mut metadata, string::utf8(b"new_description"));
        coin::update_icon_url<BEATS>(&treasury, &mut metadata, ascii::string(b"new_icon_url"));

        let symbol_bytes = ascii::as_bytes(&coin::get_symbol<BEATS>(&metadata));
        let name_bytes = string::bytes(&coin::get_name<BEATS>(&metadata));
        let description_bytes = string::bytes(&coin::get_description<BEATS>(&metadata));
        let icon_url = ascii::as_bytes(&url::inner_url(option::borrow(&coin::get_icon_url<BEATS>(&metadata))));

        assert!(*symbol_bytes == b"NEW_COIN_TESTS", 0);
        assert!(*name_bytes == b"new_coin_name", 0);
        assert!(*description_bytes == b"new_description", 0);
        assert!(*icon_url == b"new_icon_url", 0);
        
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx));
        test_scenario::end(scenario);
    }
    
    #[test, expected_failure]
    public fun test_non_owner_restrictions() {
        use sui::test_scenario;

        // create test addresses representing users
        let admin = @0xBABE;
        let recipient = @0xCAFE;
        
        //initialize the token 
        let scenario_val = test_scenario::begin(admin);
        let scenario = scenario_val;
        {
            let witness = BEATS{};
            init(witness, test_scenario::ctx(&mut scenario));
        };
        
        //non-owner can't mint the token 
        test_scenario::next_tx(&mut scenario, recipient); 
        {
            let t_cap = test_scenario::take_from_sender<TreasuryCap<BEATS>>(&scenario);
            mint(&mut t_cap, 1, recipient, test_scenario::ctx(&mut scenario));
            test_scenario::return_to_address<TreasuryCap<BEATS>>(recipient, t_cap);
        };
        
        test_scenario::end(scenario);
    }
}