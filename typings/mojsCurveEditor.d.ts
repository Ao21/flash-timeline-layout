declare module 'mojs-curve-editor' {

    class MojsCurveEditor {
        constructor(opts: MojsCurveEditor.Options);
    }

    namespace MojsCurveEditor {
        interface Options {
            name?: string;
            isSaveState?: boolean;
        }
    }

    export = MojsCurveEditor;

}