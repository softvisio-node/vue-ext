import( "froala-editor/css/froala_editor.pkgd.css" );
const { "default": FroalaEditor } = await import( "froala-editor/js/froala_editor.pkgd.min.js" );

window.FroalaEditor = FroalaEditor;
