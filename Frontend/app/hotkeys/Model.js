/**
 * 
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.hotkeys.Model',
    {
        extend: 'Ext.data.Model',

        //idProperty: 'slot',

        fields: [
            {
                name: 'slot',
                type: 'int'
            },
            {
                name: 'key',
                type: 'string',
                defaultValue: ''
            },
            {
                name: 'ctrl',
                type: 'boolean',
                defaultValue: false
            },
            {
                name: 'alt',
                type: 'boolean',
                defaultValue: false
            },
            {
                name: 'shift',
                type: 'boolean',
                defaultValue: false
            }
        ]
    }
);