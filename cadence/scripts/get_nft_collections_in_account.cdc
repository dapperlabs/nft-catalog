import MetadataViews from "./MetadataViews.cdc"
import NFTCatalog from "./NFTCatalog.cdc"


pub fun main(ownerAddress: Address) : {String:[UInt64]} {

    let account = getAuthAccount(ownerAddress)

    let inventory : {String:[UInt64]}={}
    let collections : {String:PublicPath} ={}
    let types = NFTCatalog.getCatalogTypeData()
    for nftType in types.keys {

        let typeData=types[nftType]!
        let collectionKey=typeData.keys[0]
        let catalogEntry = NFTCatalog.getCatalogEntry(collectionIdentifier:collectionKey)!
        let tempPathStr = "catalog".concat(collectionKey)
        let tempPublicPath = PublicPath(identifier: tempPathStr)!
        account.link<&{MetadataViews.ResolverCollection}>(tempPublicPath, target: catalogEntry.collectionData.storagePath)
        let cap= account.getCapability<&{MetadataViews.ResolverCollection}>(tempPublicPath)
        if cap.check(){
            inventory[nftType] = cap.borrow()!.getIDs()
        }
    }
    return inventory
}
