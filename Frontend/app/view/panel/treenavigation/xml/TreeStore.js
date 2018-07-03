/**
 * Хранилище дерева навигации по xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.treenavigation.xml.TreeStore',
    {
        extend: 'Ext.data.TreeStore',

        proxy: {
            type: 'memory'
        },

        root: {
            icon: ' ',
            cls: 'treenavigation-root treenavigation-root-xml'
        },

        defaultRootText: 'XML',
        rootVisible: true
    }
);