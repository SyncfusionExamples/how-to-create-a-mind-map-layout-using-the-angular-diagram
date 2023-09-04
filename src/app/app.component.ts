import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { ConnectorModel, DataBinding, Diagram, MindMap, NodeModel, PointPortModel, DiagramComponent } from '@syncfusion/ej2-angular-diagrams';
import { mindMapData } from './data';
import { DataManager } from '@syncfusion/ej2-data';
Diagram.Inject(DataBinding, MindMap);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  title = 'myangularproject';
  @ViewChild("diagram") diagramObj !: DiagramComponent;
  public data:object = { 
    dataSource: new DataManager(mindMapData), 
    id: 'id',
    parentId: 'parentId'
  }
  public layoutSettings:object = {
    type: 'MindMap', horizontalSpacing: 50, verticalSpacing: 20, orientation: 'Vertical'
  }

  public nodeDefaults(obj: NodeModel){
    let nodeData: any = obj.data;
    obj.annotations = [{ content: nodeData.Label, style: { color: 'White'} }];
    obj.expandIcon = { shape: 'Minus'};
    obj.collapseIcon = { shape: 'Plus'};
    obj.height = 50;
    obj.width = 130;
    if( nodeData.branch === "Root" || nodeData.branch === "Left" || nodeData.branch === "Right"){
      obj.shape = nodeData.branch !== "Root" ? { type:'Basic', shape: 'Ellipse'} : { type: 'Path', data: 'M55.7315 17.239C57.8719 21.76 54.6613 27.788 47.1698 26.0787C46.0997 32.309 33.2572 35.323 28.9764 29.2951C25.7658 35.323 10.7829 33.816 10.7829 26.0787C3.29143 30.802 -0.989391 20.253 2.22121 17.239C-0.989317 14.2249 2.22121 6.68993 10.7829 8.39934C13.9935 -0.845086 25.7658 -0.845086 28.9764 5.18301C32.187 0.661909 45.0294 0.661908 47.1698 8.39934C52.5209 5.18301 60.0123 12.7179 55.7315 17.239Z'};
      obj.style = { fill: nodeData.branch !== "Root" ? '#F39C12' : '#E74C3C', strokeWidth: 0};
    } else {
      obj.style = { fill: nodeData.branch === "subRight" ? '#8E44AD' : '#3498DB', strokeWidth: 0}
    }
    obj.ports = getPorts();
  }

  public connectorDefaults(connector: ConnectorModel, diagram: Diagram){
    let sourceNode: NodeModel = diagram.getObject(connector.sourceID as string);
    let targetNode: NodeModel = diagram.getObject(connector.targetID as string);
    let targetNodeData: any = targetNode.data;
    connector.type = "Bezier";
    connector.targetDecorator = { shape: 'None'};
    if(targetNodeData.branch === 'Right' || targetNodeData.branch === 'subRight'){
      connector.sourcePortID = (sourceNode as any).ports[1].id;
      connector.targetPortID = (targetNode as any).ports[0].id;
      connector.style = { strokeColor: '#8E44AD', strokeWidth: 3};
    } else if(targetNodeData.branch === 'Left' || targetNodeData.branch === 'subLeft'){
      connector.sourcePortID = (sourceNode as any).ports[0].id;
      connector.targetPortID = (targetNode as any).ports[1].id;
      connector.style = { strokeColor: '#3498DB', strokeWidth: 3};
    }
  }
  public create(): void {
    this.diagramObj.fitToPage();
  }
 }

 function getPorts(): PointPortModel[]{
  let ports: PointPortModel[] = [
    { id: 'port1', offset: { y: 0, x: 0.5 } },
    { id: 'port2', offset: { y: 1, x: 0.5 } }
  ]
  return ports;
 }
