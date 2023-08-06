export interface DocumentOwnerInterface {
  isOwner(documentId: string, authorId: string): Promise<boolean>
}
