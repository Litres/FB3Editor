/**
 * Панель кнопок для управления вложенностью секций.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.view.panel.main.navigation.section.Panel',
    {
        extend: 'Ext.Panel',
        requires: [
            'FBEditor.view.panel.main.navigation.section.PanelController',
            'FBEditor.view.panel.main.navigation.section.button.left.Button',
            'FBEditor.view.panel.main.navigation.section.button.right.Button'
        ],

        id: 'panel-navigation-section',
        xtype: 'panel-navigation-section',
        controller: 'panel.navigation.section',

        listeners: {
            sync: 'onSync',
            enablePanel: 'onEnablePanel',
            disablePanel: 'onDisablePanel'
        },

        defaults: {
            margin: '0 5 0 0'
        },

        margin: '5 0 5 45',
        hidden: true,

        /**
         * @private
         * @property {FBEditor.view.panel.main.navigation.section.button.left.Button} Кнопка сдвига секции влево.
         */
        buttonLeft: null,

        /**
         * @private
         * @property {FBEditor.view.panel.main.navigation.section.button.right.Button} Кнопка сдвига секции вправо.
         */
        buttonRight: null,

        initComponent: function ()
        {
            var me = this;

            me.items = [
                {
                    xtype: 'panel-navigation-section-button-left'
                },
                {
                    xtype: 'panel-navigation-section-button-right'
                }
            ];

            me.callParent(arguments);
        },

        /**
         * Возвращает массив кнопок панели.
         * @return {FBEditor.view.panel.main.navigation.section.button.AbstractButton[]} Кнопки.
         */
        getButtons: function ()
        {
            var me = this,
                buttons;

            buttons = [
                me.getButtonLeft(),
                me.getButtonRight()
            ];

            return buttons;
        },

        /**
         * Возвращает кнопку сдвига секции влево.
         * @return {FBEditor.view.panel.main.navigation.section.button.left.Button}
         */
        getButtonLeft: function ()
        {
            var me = this,
                btn;

            btn = me.buttonLeft || me.down('panel-navigation-section-button-left');
            me.buttonLeft = btn;

            return btn;
        },

        /**
         * Возвращает кнопку сдвига секции вправо.
         * @return {FBEditor.view.panel.main.navigation.section.button.right.Button}
         */
        getButtonRight: function ()
        {
            var me = this,
                btn;

            btn = me.buttonRight || me.down('panel-navigation-section-button-right');
            me.buttonRight = btn;

            return btn;
        }
    }
);