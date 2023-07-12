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
            b"Soundbeats Token", 
            option::some(url::new_unsafe_from_bytes(b"http://game.soundbeats.io/beats-icon.png")),
            ctx
        );
        
        //TODO: change this to public share 
        transfer::public_freeze_object(metadata);
        
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