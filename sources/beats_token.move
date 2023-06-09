module soundbeats::beats {
    use std::option;
    use sui::coin;
    use sui::transfer;
    use sui::event;
    use sui::tx_context::{Self, TxContext};

    /// The type identifier of coin. The coin will have a type
    /// tag of kind: `Coin<package_object::mycoin::MYCOIN>`
    /// Make sure that the name of the type matches the module's name.
    struct BEATS has drop {}

    /// Module initializer is called once on module publish. A treasury
    /// cap is sent to the publisher, who then controls minting and burning
    fun init(
        witness: BEATS, 
        ctx: &mut TxContext
    ) {
        let (treasury, metadata) = coin::create_currency(witness, 6, b"BEATS", b"", b"", option::none(), ctx);
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx))
    }

    // ===== Public view functions =====
    
    // ===== Events =====

    struct TokenMinted has copy, drop {
        creator: address,
        recipient: address,
        quantity: u64
    }
    
    // ===== Entrypoints =====
    
    /// Mint new tokens 
    public entry fun mint(
        recipient: address,
        quantity: u64,
        ctx: &mut TxContext
    ) {
        //TODO: add security here (minter must be authorized)
        let sender = tx_context::sender(ctx);
        
        //TODO: add security (authorized owner, ownership transfer)
        
        event::emit(TokenMinted {
            creator: sender,
            recipient: recipient,
            quantity: quantity
        });
    }
}