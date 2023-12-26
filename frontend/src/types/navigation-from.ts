import { Location } from "react-router-dom";

export class NavigationFrom {
    constructor(public location: Location | null) {}

    static isInstance(obj: any): obj is NavigationFrom {
        return "location" in obj;
    }
}
