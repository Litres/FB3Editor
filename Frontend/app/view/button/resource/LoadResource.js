/**
 * Кнопка загрузки ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.button.resource.LoadResource',
    {
        extend: 'FBEditor.view.button.resource.AbstractLoadResource',
        requires: [
            'FBEditor.command.LoadResource'
        ],

        id: 'button-load-resource',
        xtype: 'button-load-resource',

        text: 'Загрузить ресурс',

        cmdClass: 'FBEditor.command.LoadResource'
    }
);