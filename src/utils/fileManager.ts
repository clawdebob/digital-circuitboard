import store from '../store/store';
import * as _ from 'lodash';
import {SchemeDataState} from '../store/consts/schemeDataStates.consts';
import {Subject} from 'rxjs';

export class FileManager {
  public static makeFile(data: SchemeDataState): string {
    const {wires, elements, name} = data;

    const wiresData = _.map(wires, wire => ({
      name: wire.name,
      id: wire.id,
      wiredTo: _.map(wire.wiredTo, 'element.id')
    }));

    const elementsData = _.map(elements, element => ({
      name: element.name,
      id: element.id,
      props: element.props,
      dimensions: element.dimensions,
    }));

    return JSON.stringify({
      name,
      elements: elementsData,
      wires: wiresData,
    }, null, '\t');
  }

  public static saveFile() {
    const {schemeData} = store.getState();
    const saveData = this.makeFile(schemeData);
    const element = document.createElement('a');

    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(saveData));
    element.setAttribute('download', schemeData.name + '.dcb');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  public static async loadData(data: SchemeDataState) {
    console.log(data);
  }

  public static loadFile(file: File) {
    const reader = new FileReader();
    const observable = new Subject();

    reader.readAsText(file);

    reader.onload = () => {
      this.loadData(JSON.parse(String(reader.result)))
        .then(data => {
          observable.next(data);
        });
    };

    reader.onerror = () => {
      console.log(reader.error);
    };

    return observable;
  }

  public static openFile() {
    const input = document.createElement('input');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.dcb');

    input.onchange = () => {

      if (input.files) {
        const file = input.files[0];

        if (file) {
          this.loadFile(file);
        }
      }

      document.body.removeChild(input);
    };

    input.style.display = 'none';
    document.body.appendChild(input);

    input.click();
  }
}