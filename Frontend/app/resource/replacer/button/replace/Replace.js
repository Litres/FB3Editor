/**
 * Кнопка замены ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.resource.replacer.button.replace.Replace',
    {
        extend: 'FBEditor.resource.replacer.button.AbstractButton',
        requires: [
            'FBEditor.resource.replacer.button.replace.ReplaceController'
        ],

        xtype: 'resource-replacer-button-replace',
        controller: 'resource.replacer.button.replace',

        translateText: {
            text: 'Заменить имеющийся ресурс новым'
        }
    }
);