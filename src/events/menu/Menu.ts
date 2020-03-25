import { MenuItem } from './MenuItem';

export class Menu {
  private nodes: MenuItem[] = [];

  constructor(nodes: MenuItem[]) {
    this.refresh(nodes);
  }

  public refresh(newNodes: MenuItem[]): void {
    let i = 0;
    while (i < this.nodes.length && i < newNodes.length) {
      // Remove node if IDs are different.
      if (this.nodes[i].id !== newNodes[i].id) {
        this.nodes[i].remove();
        this.nodes.splice(i, 1);
        continue;
      }
      // Update title
      if (this.nodes[i].title != newNodes[i].title)
        this.nodes[i].updateTitle(newNodes[i].title);
      i++;
    }
    const overCnt = this.nodes.length - newNodes.length;
    // Remove nodes
    for (let i = overCnt; i > 0; i--) {
      this.nodes[this.nodes.length - 1].remove();
      this.nodes.pop();
    }
    // Insert nodes
    for (let i = newNodes.length + overCnt; i < newNodes.length; i++) {
      newNodes[i].create();
      this.nodes.push(newNodes[i]);
    }
  }
}
