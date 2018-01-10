/**
 * Абстрактная кнопка загрузки ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.button.resource.AbstractLoadResource',
    {
        extend: 'FBEditor.view.button.AbstractFileButton',
        requires: [
            'FBEditor.view.button.resource.AbstractLoadResourceController'
        ],

        controller: 'button.abstractload.resource',

        text: 'Загрузить ресурс',

        /**
         * @property {String} Выполняемая команда.
         */
        cmdClass: '',

        listeners: {
            change: 'onChange'
        },

        initComponent: function ()
        {
            var me = this,
                types = FBEditor.resource.Manager.types;

            me.accept = types.join(',');

            me.callParent(arguments);
        }
    }
);