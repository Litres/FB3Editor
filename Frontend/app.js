/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.application({
    name: 'FBEditor',

    extend: 'FBEditor.Application',
    
    autoCreateViewport: 'FBEditor.view.main.Main'
	
    //-------------------------------------------------------------------------
    // Most customizations should be made to FBEditor.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------
});

// Загружаем сторонние ресурсы
Ext.Loader.loadScript('bower_components/Blob.js/Blob.js');
Ext.Loader.loadScript('bower_components/jszip/dist/jszip.min.js');
Ext.Loader.loadScript('bower_components/FileSaver.js/FileSaver.min.js');
Ext.Loader.loadScript('bower_components/jsxml/stand.js');
Ext.Loader.loadScript('bower_components/jsxml/jsxml.js');
Ext.Loader.loadScript('bower_components/x2js/xml2json.min.js');
Ext.Loader.loadScript('bower_components/xmllint/index.js');