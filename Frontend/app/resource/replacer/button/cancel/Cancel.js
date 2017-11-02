/**
 * Кнопка отмены загрузки ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.resource.replacer.button.cancel.Cancel',
    {
        extend: 'FBEditor.resource.replacer.button.AbstractButton',
        requires: [
            'FBEditor.resource.replacer.button.cancel.CancelController'
        ],

        xtype: 'resource-replacer-button-cancel',
        controller: 'resource.replacer.button.cancel',

        translateText: {
            text: 'Отменить операцию'
        }
    }
);