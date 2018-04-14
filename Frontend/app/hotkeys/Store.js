/**
 * Хранилище горячих клавиш.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.hotkeys.Store',
    {
        extend: 'Ext.data.Store',

        model: 'FBEditor.hotkeys.Model',

        proxy: {
            type: 'localstorage',
            id: 'FBEditor-hotkeys'
        },

        autoSync: true,
        autoLoad: true,
        pageSize: 0
    }
);