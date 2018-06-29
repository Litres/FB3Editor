/**
 * Абстрактный класс кнопки.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.view.panel.main.navigation.section.button.AbstractButton',
    {
        extend: 'Ext.Button',
        requires: [
            'FBEditor.view.panel.main.navigation.section.button.AbstractButtonController'
        ],

        controller: 'panel.navigation.section.button',

        listeners: {
            click: 'onClick',
            sync: 'onSync'
        },

        tooltipType: 'title',

        /**
         * @protected
         * Класс команды.
         */
        cmdClass: '',

        /**
         * Возвращает активный менеджер редактора текста.
         */
        getEditorManager: function ()
        {
            return FBEditor.getEditorManager();
        },

        /**
         * @template
         * Активна ли кнопка для текущего выделения в тексте.
         */
        isActiveSelection: function ()
        {
            return false;
        }
    }
);