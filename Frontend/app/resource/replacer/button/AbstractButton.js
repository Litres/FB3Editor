/**
 * Абстрактная кнопка операции.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.resource.replacer.button.AbstractButton',
    {
        extend: 'Ext.Button',

        listeners: {
            click: {
                el: 'body',
                fn: 'onClick'
            }
        },

        /**
         * @private
         * @property {FBEditor.resource.replacer.Window} Окно выбора операции.
         */
        win: null,

        initComponent: function ()
        {
            var me = this,
                tt = me.translateText;

            me.text = tt.text;

            me.callParent(arguments);
        },

        /**
         * Возвращает окно выбора операции.
         * @return {FBEditor.resource.replacer.Window}
         */
        getWindow: function ()
        {
            return this.win;
        }
    }
);