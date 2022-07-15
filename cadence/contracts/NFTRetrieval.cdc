import MetadataViews from "./MetadataViews.cdc"
import NFTCatalog from "./NFTCatalog.cdc"

// NFTRetrieval
//
// A helper contract to get NFT's in a users account
// leveraging the NFTCatalog Smart Contract

pub contract NFTRetrieval {

    pub struct BaseNFTViewsV1 {
        pub let id: UInt64
        pub let display: MetadataViews.Display?
        pub let externalURL: MetadataViews.ExternalURL?
        pub let collectionData: MetadataViews.NFTCollectionData?
        pub let collectionDisplay: MetadataViews.NFTCollectionDisplay?
        pub let royalties: MetadataViews.Royalties?

        init(
            id : UInt64,
            display : MetadataViews.Display?,
            externalURL : MetadataViews.ExternalURL?,
            collectionData : MetadataViews.NFTCollectionData?,
            collectionDisplay : MetadataViews.NFTCollectionDisplay?,
            royalties : MetadataViews.Royalties?
        ) {
            self.id = id
            self.display = display
            self.externalURL = externalURL
            self.collectionData = collectionData
            self.collectionDisplay = collectionDisplay
            self.royalties = royalties
        }
    }

    pub fun getRecommendedViewsTypes(version: String) : [Type] {
        switch version {
            case "v1":
                return [
                        Type<MetadataViews.Display>(), 
                        Type<MetadataViews.ExternalURL>(), 
                        Type<MetadataViews.NFTCollectionData>(), 
                        Type<MetadataViews.NFTCollectionDisplay>(),
                        Type<MetadataViews.Royalties>()
                ]
            default:
                panic("Version not supported")
        } 
        return []
    }

    pub fun getNFTViewsFromCap(collectionIdentifier: String, collectionCap : Capability<&AnyResource{MetadataViews.ResolverCollection}>) : [BaseNFTViewsV1] {
        pre {
            NFTCatalog.getCatalog()[collectionIdentifier] != nil : "Invalid collection identifier"
        }
        let catalog = NFTCatalog.getCatalog()
        let items : [BaseNFTViewsV1] = []
        let value = catalog[collectionIdentifier]!

        // Check if we have multiple collections for the NFT type...
        let hasMultipleCollections = self.hasMultipleCollections(nftTypeIdentifier : value.nftType.identifier)
        
        if collectionCap.check() {
            let collectionRef = collectionCap.borrow()!
            for id in collectionRef.getIDs() {
                let nftResolver = collectionRef.borrowViewResolver(id: id)
                let nftViews = self.getBasedNFTViewsV1(id: id, nftResolver: nftResolver)
                if !hasMultipleCollections {
                    items.append(nftViews)
                } else if nftViews.display!.name == value.collectionDisplay.name {
                    items.append(nftViews)
                }
            
            }
        }

        return items
    }

    pub fun getBasedNFTViewsV1(id : UInt64, nftResolver : &AnyResource{MetadataViews.Resolver}) : BaseNFTViewsV1 {
        return BaseNFTViewsV1(
            id : id,
            display: self.getDisplay(nftResolver),
            externalURL : self.getExternalURL(nftResolver),
            collectionData : self.getNFTCollectionData(nftResolver),
            collectionDisplay : self.getNFTCollectionDisplay(nftResolver),
            royalties : self.getRoyalties(nftResolver)
        )
    }

    pub fun getDisplay(_ viewResolver: &{MetadataViews.Resolver}) : MetadataViews.Display? {
        if let view = viewResolver.resolveView(Type<MetadataViews.Display>()) {
            if let v = view as? MetadataViews.Display {
                return v
            }
        }
        return nil
    }

    pub fun getExternalURL(_ viewResolver: &{MetadataViews.Resolver}) : MetadataViews.ExternalURL? {
        if let view = viewResolver.resolveView(Type<MetadataViews.ExternalURL>()) {
            if let v = view as? MetadataViews.ExternalURL {
                return v
            }
        }
        return nil
    }

    pub fun getNFTCollectionData(_ viewResolver: &{MetadataViews.Resolver}) : MetadataViews.NFTCollectionData? {
        if let view = viewResolver.resolveView(Type<MetadataViews.NFTCollectionData>()) {
            if let v = view as? MetadataViews.NFTCollectionData {
                return v
            }
        }
        return nil
    }

    pub fun getNFTCollectionDisplay(_ viewResolver: &{MetadataViews.Resolver}) : MetadataViews.NFTCollectionDisplay? {
        if let view = viewResolver.resolveView(Type<MetadataViews.NFTCollectionDisplay>()) {
            if let v = view as? MetadataViews.NFTCollectionDisplay {
                return v
            }
        }
        return nil
    }

    pub fun getRoyalties(_ viewResolver: &{MetadataViews.Resolver}) : MetadataViews.Royalties? {
        if let view = viewResolver.resolveView(Type<MetadataViews.Royalties>()) {
            if let v = view as? MetadataViews.Royalties {
                return v
            }
        }
        return nil
    }

    access(contract) fun hasMultipleCollections(nftTypeIdentifier : String): Bool {
        let typeCollections = NFTCatalog.getCollectionsForType(nftTypeIdentifier: nftTypeIdentifier)!
        var numberOfCollections = 0
        for identifier in typeCollections.keys {
            let existence = typeCollections[identifier]!
            if existence {
                numberOfCollections = numberOfCollections + 1
            }
            if numberOfCollections > 1 {
                return true
            }
        }
        return false
    }

    pub fun getInventory(address:Address) : {String: [UInt64]} {
        let inventory : {String:[UInt64]}={}
        let account=getAccount(address)
        let collections : {String:PublicPath} ={}
        let types = NFTCatalog.getCatalogTypeData()
        for nftType in types.keys {
            let typeData=types[nftType]!
            let collectionKey=typeData.keys[0]
            let catalogEntry = NFTCatalog.getCatalogEntry(collectionIdentifier:collectionKey)!
            let path =catalogEntry.collectionData.publicPath
            let cap= account.getCapability<&{MetadataViews.ResolverCollection}>(path)
            if cap.check(){
                inventory[nftType] = cap.borrow()!.getIDs()
            }
        }
        return inventory
    }

    init() {}

}
