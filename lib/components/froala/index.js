import( "froala-editor/css/froala_editor.pkgd.css" );
import( "froala-editor/css/froala_style.css" );
import( "froala-editor/css/plugins.pkgd.css" );
const { "default": FroalaEditor } = await import( "froala-editor" );
import( "froala-editor/js/plugins.pkgd.min.js" );

window.FroalaEditor = FroalaEditor;

// import "froala-editor/css/froala_editor.pkgd.css";
// import "froala-editor/css/froala_style.css";
// import "froala-editor/css/plugins.pkgd.css";
// import FroalaEditor from "froala-editor";
// import "froala-editor/js/plugins.pkgd.min.js";

// window.FroalaEditor = FroalaEditor;
