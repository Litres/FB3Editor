/**
 * Кнопка замены ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.button.resource.ReplaceResource',
    {
        extend: 'FBEditor.view.button.resource.AbstractLoadResource',
        requires: [
            'FBEditor.view.button.resource.ReplaceResourceController',
            'FBEditor.command.ReplaceResource'
        ],

        id: 'button-replace-resource',
        xtype: 'button-replace-resource',
        controller: 'button.replace.resource',

        width: '100%',
        text: 'Заменить',

        cmdClass: 'FBEditor.command.ReplaceResource',

        /**
         * @private
         * @property {String} Имя ресурса.
         */
        nameResource: null,

        /**
         * Устанавливает имя ресурса.
         * @param {String} name Имя ресурса.
         */
        setResource: function (name)
        {
            this.nameResource = name;
        }
    }
);