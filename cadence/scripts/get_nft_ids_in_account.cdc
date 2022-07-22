import MetadataViews from "../contracts/MetadataViews.cdc"
import NFTCatalog from "../contracts/NFTCatalog.cdc"
import NFTRetrieval from "../contracts/NFTRetrieval.cdc"

pub fun main(ownerAddress: Address) : {String : [UInt64]} {
    let catalog = NFTCatalog.getCatalog()
    let account = getAuthAccount(ownerAddress)

    let items : {String : [UInt64]} = {}

    for key in catalog.keys {
        let value = catalog[key]!
        let tempPathStr = "catalogIDs".concat(key)
        let tempPublicPath = PublicPath(identifier: tempPathStr)!
        account.link<&{MetadataViews.ResolverCollection}>(
            tempPublicPath,
            target: value.collectionData.storagePath
        )

        let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)
        if !collectionCap.check() {
            continue
        }

        let ids = NFTRetrieval.getNFTIDsFromCap(collectionIdentifier : key, collectionCap : collectionCap)

        if ids.length > 0 {
            items[key] = ids
        }
    }
    return items

}