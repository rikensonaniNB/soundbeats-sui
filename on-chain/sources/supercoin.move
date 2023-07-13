// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

// Defines the `Coin` type - platform wide representation of fungible
// tokens and coins. `Coin` can be described as a secure wrapper around
// `Balance` type.
// 
// 
module soundbeats::superbeats {
    use std::string;
    use std::ascii;
    use std::option::{Self, Option};
    use sui::balance::{Self, Balance, Supply};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::url::{Self, Url};
    use std::vector;
    use sui::tx_context::{Self, TxContext};
    
    
    //use std::option;
    //use sui::url;
    //use sui::transfer;
    //use sui::tx_context::{Self, TxContext};

    /// A type passed to create_supply is not a one-time witness.
    const EBadWitness: u64 = 0;
    /// Invalid arguments are passed to a function.
    const EInvalidArg: u64 = 1;
    /// Trying to split a coin more times than its balance allows.
    const ENotEnough: u64 = 2;
    /// Doing something that requires ownership, but caller is not owner
    const ENotOwner: u64 = 3;

    /// A coin of type `T` worth `value`. Transferable and storable
    struct Coin<phantom T> has key {
        id: UID,
        balance: Balance<T>
    }

    /// Each Coin type T created through `create_currency` function will have a
    /// unique instance of CoinMetadata<T> that stores the metadata for this coin type.
    struct CoinMetadata<phantom T> has key, store {
        id: UID,
        /// Number of decimal places the coin uses.
        /// A coin with `value ` N and `decimals` D should be shown as N / 10^D
        /// E.g., a coin with `value` 7002 and decimals 3 should be displayed as 7.002
        /// This is metadata for display usage only.
        decimals: u8,
        /// Name for the token
        name: string::String,
        /// Symbol for the token
        symbol: ascii::String,
        /// Description of the token
        description: string::String,
        /// URL for the token logo
        icon_url: Option<Url>,
        owner: address
    }

    /// Capability allowing the bearer to mint and burn
    /// coins of type `T`. Transferable
    struct TreasuryCap<phantom T> has key, store {
        id: UID,
        total_supply: Supply<T>
    }

    // === Supply <-> TreasuryCap morphing and accessors  ===

    /// Return the total number of `T`'s in circulation.
    public fun total_supply<T>(cap: &TreasuryCap<T>): u64 {
        balance::supply_value(&cap.total_supply)
    }

    /// Unwrap `TreasuryCap` getting the `Supply`.
    ///
    /// Operation is irreversible. Supply cannot be converted into a `TreasuryCap` due
    /// to different security guarantees (TreasuryCap can be created only once for a type)
    public fun treasury_into_supply<T>(treasury: TreasuryCap<T>): Supply<T> {
        let TreasuryCap { id, total_supply } = treasury;
        object::delete(id);
        total_supply
    }

    /// Get immutable reference to the treasury's `Supply`.
    public fun supply_immut<T>(treasury: &TreasuryCap<T>): &Supply<T> {
        &treasury.total_supply
    }

    /// Get mutable reference to the treasury's `Supply`.
    public fun supply_mut<T>(treasury: &mut TreasuryCap<T>): &mut Supply<T> {
        &mut treasury.total_supply
    }

    // === Balance <-> Coin accessors and type morphing ===

    /// Public getter for the coin's value
    public fun value<T>(self: &Coin<T>): u64 {
        balance::value(&self.balance)
    }

    /// Get immutable reference to the balance of a coin.
    public fun balance<T>(coin: &Coin<T>): &Balance<T> {
        &coin.balance
    }

    /// Get a mutable reference to the balance of a coin.
    public fun balance_mut<T>(coin: &mut Coin<T>): &mut Balance<T> {
        &mut coin.balance
    }

    /// Wrap a balance into a Coin to make it transferable.
    public fun from_balance<T>(balance: Balance<T>, ctx: &mut TxContext): Coin<T> {
        Coin { id: object::new(ctx), balance }
    }

    /// Destruct a Coin wrapper and keep the balance.
    public fun into_balance<T>(coin: Coin<T>): Balance<T> {
        let Coin { id, balance } = coin;
        object::delete(id);
        balance
    }

    /// Take a `Coin` worth of `value` from `Balance`.
    /// Aborts if `value > balance.value`
    public fun take<T>(
        balance: &mut Balance<T>, value: u64, ctx: &mut TxContext,
    ): Coin<T> {
        Coin {
            id: object::new(ctx),
            balance: balance::split(balance, value)
        }
    }

    spec take {
        let before_val = balance.value;
        let post after_val = balance.value;
        ensures after_val == before_val - value;

        aborts_if value > before_val;
        aborts_if ctx.ids_created + 1 > MAX_U64;
    }

    /// Put a `Coin<T>` to the `Balance<T>`.
    public fun put<T>(balance: &mut Balance<T>, coin: Coin<T>) {
        balance::join(balance, into_balance(coin));
    }

    spec put {
        let before_val = balance.value;
        let post after_val = balance.value;
        ensures after_val == before_val + coin.balance.value;

        aborts_if before_val + coin.balance.value > MAX_U64;
    }

    // === Base Coin functionality ===

    /// Consume the coin `c` and add its value to `self`.
    /// Aborts if `c.value + self.value > U64_MAX`
    public entry fun join<T>(self: &mut Coin<T>, c: Coin<T>) {
        let Coin { id, balance } = c;
        object::delete(id);
        balance::join(&mut self.balance, balance);
    }

    spec join {
        let before_val = self.balance.value;
        let post after_val = self.balance.value;
        ensures after_val == before_val + c.balance.value;

        aborts_if before_val + c.balance.value > MAX_U64;
    }

    /// Split coin `self` to two coins, one with balance `split_amount`,
    /// and the remaining balance is left is `self`.
    public fun split<T>(
        self: &mut Coin<T>, split_amount: u64, ctx: &mut TxContext
    ): Coin<T> {
        take(&mut self.balance, split_amount, ctx)
    }

    spec split {
        let before_val = self.balance.value;
        let post after_val = self.balance.value;
        ensures after_val == before_val - split_amount;

        aborts_if split_amount > before_val;
        aborts_if ctx.ids_created + 1 > MAX_U64;
    }

    /// Split coin `self` into `n - 1` coins with equal balances. The remainder is left in
    /// `self`. Return newly created coins.
    public fun divide_into_n<T>(
        self: &mut Coin<T>, n: u64, ctx: &mut TxContext
    ): vector<Coin<T>> {
        assert!(n > 0, EInvalidArg);
        assert!(n <= value(self), ENotEnough);

        let vec = vector::empty<Coin<T>>();
        let i = 0;
        let split_amount = value(self) / n;
        while ({
            spec {
                invariant i <= n-1;
                invariant self.balance.value == old(self).balance.value - (i * split_amount);
                invariant ctx.ids_created == old(ctx).ids_created + i;
            };
            i < n - 1
        }) {
            vector::push_back(&mut vec, split(self, split_amount, ctx));
            i = i + 1;
        };
        vec
    }

    spec divide_into_n {
        let before_val = self.balance.value;
        let post after_val = self.balance.value;
        let split_amount = before_val / n;
        ensures after_val == before_val - ((n - 1) * split_amount);

        aborts_if n == 0;
        aborts_if self.balance.value < n;
        aborts_if ctx.ids_created + n - 1 > MAX_U64;
    }

    /// Make any Coin with a zero value. Useful for placeholding
    /// bids/payments or preemptively making empty balances.
    public fun zero<T>(ctx: &mut TxContext): Coin<T> {
        Coin { id: object::new(ctx), balance: balance::zero() }
    }

    /// Destroy a coin with value zero
    public fun destroy_zero<T>(c: Coin<T>) {
        let Coin { id, balance } = c;
        object::delete(id);
        balance::destroy_zero(balance)
    }

    // === Registering new coin types and managing the coin supply ===

    /// Create a new currency type `T` as and return the `TreasuryCap` for
    /// `T` to the caller. Can only be called with a `one-time-witness`
    /// type, ensuring that there's only one `TreasuryCap` per `T`.
    public fun create_currency<T: drop>(
        witness: T,
        decimals: u8,
        symbol: vector<u8>,
        name: vector<u8>,
        description: vector<u8>,
        icon_url: Option<Url>,
        owner: address,
        ctx: &mut TxContext
    ): (TreasuryCap<T>, CoinMetadata<T>) {
        // Make sure there's only one instance of the type T
        assert!(sui::types::is_one_time_witness(&witness), EBadWitness);

        (
            TreasuryCap {
                id: object::new(ctx),
                total_supply: balance::create_supply(witness)
            },
            CoinMetadata {
                id: object::new(ctx),
                decimals,
                name: string::utf8(name),
                symbol: ascii::string(symbol),
                description: string::utf8(description),
                icon_url, 
                owner
            }
        )
    }

    /// Create a coin worth `value`. and increase the total supply
    /// in `cap` accordingly.
    public fun mint<T>(
        cap: &mut TreasuryCap<T>, value: u64, ctx: &mut TxContext,
    ): Coin<T> {
        //TODO: restrict to owner 
        //assert!(tx_context::sender(ctx) == cap.metadata.owner, ENotOwner);
        assert!(tx_context::sender(ctx) != tx_context::sender(ctx), ENotOwner);
        Coin {
            id: object::new(ctx),
            balance: balance::increase_supply(&mut cap.total_supply, value)
        }
    }

    spec schema MintBalance<T> {
        cap: TreasuryCap<T>;
        value: u64;

        let before_supply = cap.total_supply.value;
        let post after_supply = cap.total_supply.value;
        ensures after_supply == before_supply + value;

        aborts_if before_supply + value >= MAX_U64;
    }

    spec mint {
        include MintBalance<T>;
        aborts_if ctx.ids_created + 1 > MAX_U64;
        aborts_if ctx.sender != ctx.coin.owner;
    }

    /// Mint some amount of T as a `Balance` and increase the total
    /// supply in `cap` accordingly.
    /// Aborts if `value` + `cap.total_supply` >= U64_MAX
    public fun mint_balance<T>(
        cap: &mut TreasuryCap<T>, value: u64
    ): Balance<T> {
        //TODO: restrict to owner 
        balance::increase_supply(&mut cap.total_supply, value)
    }

    spec mint_balance {
        include MintBalance<T>;
    }

    /// Destroy the coin `c` and decrease the total supply in `cap`
    /// accordingly.
    public entry fun burn<T>(cap: &mut TreasuryCap<T>, c: Coin<T>): u64 {
        //TODO: restrict to owner 
        let Coin { id, balance } = c;
        object::delete(id);
        balance::decrease_supply(&mut cap.total_supply, balance)
    }

    spec schema Burn<T> {
        cap: TreasuryCap<T>;
        c: Coin<T>;

        let before_supply = cap.total_supply.value;
        let post after_supply = cap.total_supply.value;
        ensures after_supply == before_supply - c.balance.value;

        aborts_if before_supply < c.balance.value;
    }

    spec burn {
        include Burn<T>;
    }

    // === Entrypoints ===

    /// Mint `amount` of `Coin` and send it to `recipient`. Invokes `mint()`.
    public entry fun mint_and_transfer<T>(
        c: &mut TreasuryCap<T>, amount: u64, recipient: address, ctx: &mut TxContext
    ) {
        //TODO: restrict to owner 
        transfer::transfer(mint(c, amount, ctx), recipient)
    }

    // === Update coin metadata ===

    /// Update name of the coin in `CoinMetadata`
    public entry fun update_name<T>(
        _treasury: &TreasuryCap<T>, metadata: &mut CoinMetadata<T>, name: string::String, ctx: &mut TxContext
    ) {
        assert!(metadata.owner == tx_context::sender(ctx), ENotOwner); 
        metadata.name = name;
    }

    /// Update the symbol of the coin in `CoinMetadata`
    public entry fun update_symbol<T>(
        _treasury: &TreasuryCap<T>, metadata: &mut CoinMetadata<T>, symbol: ascii::String, ctx: &mut TxContext
    ) {
        assert!(metadata.owner == tx_context::sender(ctx), ENotOwner); 
        metadata.symbol = symbol;
    }

    /// Update the description of the coin in `CoinMetadata`
    public entry fun update_description<T>(
        _treasury: &TreasuryCap<T>, metadata: &mut CoinMetadata<T>, description: string::String, ctx: &mut TxContext
    ) {
        assert!(metadata.owner == tx_context::sender(ctx), ENotOwner); 
        metadata.description = description;
    }

    /// Update the url of the coin in `CoinMetadata`
    public entry fun update_icon_url<T>(
        _treasury: &TreasuryCap<T>, metadata: &mut CoinMetadata<T>, url: ascii::String, ctx: &mut TxContext
    ) {
        assert!(metadata.owner == tx_context::sender(ctx), ENotOwner); 
        metadata.icon_url = option::some(url::new_unsafe(url));
    }

    // === Get coin metadata fields for on-chain consumption ===

    public fun get_decimals<T>(
        metadata: &CoinMetadata<T>
    ): u8 {
        metadata.decimals
    }

    public fun get_name<T>(
        metadata: &CoinMetadata<T>
    ): string::String {
        metadata.name
    }

    public fun get_symbol<T>(
        metadata: &CoinMetadata<T>
    ): ascii::String {
        metadata.symbol
    }

    public fun get_description<T>(
        metadata: &CoinMetadata<T>
    ): string::String {
        metadata.description
    }

    public fun get_icon_url<T>(
        metadata: &CoinMetadata<T>
    ): Option<Url> {
        metadata.icon_url
    }

    // === Test-only code ===

    #[test_only]
    /// Mint coins of any type for (obviously!) testing purposes only
    public fun mint_for_testing<T>(value: u64, ctx: &mut TxContext): Coin<T> {
        Coin { id: object::new(ctx), balance: balance::create_for_testing(value) }
    }

    #[test_only]
    /// Burn coins of any type for testing purposes only
    public fun burn_for_testing<T>(coin: Coin<T>): u64 {
        let Coin { id, balance } = coin;
        object::delete(id);
        balance::destroy_for_testing(balance)
    }

    // === Deprecated code ===

    // oops, wanted treasury: &TreasuryCap<T>
    public fun supply<T>(treasury: &mut TreasuryCap<T>): &Supply<T> {
        &treasury.total_supply
    }

    // deprecated as we have CoinMetadata now
    struct CurrencyCreated<phantom T> has copy, drop {
        decimals: u8
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
/*
    /// Name of the coin. By convention, this type has the same name as its parent module
    /// and has no fields. The full type of the coin defined by this module will be `COIN<MANAGED>`.
    struct SUPERBEATS has drop { }

    /// Register the managed currency to acquire its `TreasuryCap`. Because
    /// this is a module initializer, it ensures the currency only gets
    /// registered once.
    fun init(witness: SUPERBEATS, ctx: &mut TxContext) {
        // Get a treasury cap for the coin and give it to the transaction sender
        //let foo = option::Option<sui::url> { vec: b"" };
        let (treasury_cap, metadata) = superbeats::create_currency<SUPERBEATS>(
            witness, 
            2, 
            b"BEAT$", 
            b"BEAT$", 
            b"Soundbeats Token", 
            option::some(url::new_unsafe_from_bytes(b"http://game.soundbeats.io/beats-icon.png")),
            tx_context::sender(ctx),
            ctx
        );
        transfer::public_freeze_object(metadata);
        transfer::transfer(treasury_cap, tx_context::sender(ctx))
    }

    /// Only manager can mint new coins
    public entry fun mint(
        treasury_cap: &mut TreasuryCap<SUPERBEATS>, amount: u64, recipient: address, ctx: &mut TxContext
    ) {
        superbeats::mint_and_transfer(treasury_cap, amount, recipient, ctx);
    }

    /// Only manager can burn coins
    public entry fun burn(treasury_cap: &mut TreasuryCap<SUPERBEATS>, coin: Coin<SUPERBEATS>) {
        superbeats::burn(treasury_cap, coin);
    }

    #[test_only]
    public fun test_init(ctx: &mut TxContext) {
        init(SUPERBEATS { }, ctx)
    }
    
    #[test_only]
    public fun test_security_lifecycle() {
        use sui::test_scenario;

        // create test addresses representing users
        let admin = @0xBABE;
        let recipient = @0xCAFE;
        
        //initialize the token 
        let scenario_val = test_scenario::begin(admin);
        let scenario = &mut scenario_val;
        {
            let witness = SUPERBEATS{};
            init(witness, test_scenario::ctx(scenario));
        };
        
        //admin can mint the token 
        test_scenario::next_tx(scenario, admin); 
        {
            let t_cap = test_scenario::take_from_sender<TreasuryCap<SUPERBEATS>>(scenario);
            mint(&mut t_cap, 1, recipient, test_scenario::ctx(scenario));
            test_scenario::return_to_address<TreasuryCap<SUPERBEATS>>(recipient, t_cap);
            
            //TODO: assert balance 
            assert!(0 == 1, 99);
        };
        
        //admin can mint to self
        test_scenario::next_tx(scenario, admin); 
        {
            let t_cap = test_scenario::take_from_sender<TreasuryCap<SUPERBEATS>>(scenario);
            mint(&mut t_cap, 1, admin, test_scenario::ctx(scenario));
            test_scenario::return_to_address<TreasuryCap<SUPERBEATS>>(recipient, t_cap);
        };
        
        //admin can burn
        test_scenario::next_tx(scenario, admin); 
        {
            let coin = test_scenario::take_from_sender<Coin<SUPERBEATS>>(scenario);
            let t_cap = test_scenario::take_from_sender<TreasuryCap<SUPERBEATS>>(scenario);
            burn(&mut t_cap, coin);
            test_scenario::return_to_address<TreasuryCap<SUPERBEATS>>(admin, t_cap);
        };
        
        test_scenario::end(scenario_val);
    }
*/
}