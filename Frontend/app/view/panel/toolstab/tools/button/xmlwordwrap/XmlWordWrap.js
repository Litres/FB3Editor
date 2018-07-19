/**
 * Кнопка включения переноса длинных строк в редакторе xml.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.toolstab.tools.button.xmlwordwrap.XmlWordWrap',
    {
        extend: 'Ext.Button',

        id: 'panel-toolstab-tools-button-xmlwordwrap',
        xtype: 'panel-toolstab-tools-button-xmlwordwrap',

        enableToggle: true,
        tooltipType: 'title',
        html: '<i class="fa fa-exchange"></i>',
        tooltip: 'Переносить длинные строки в редакторе XML',

        handler: function ()
        {
            var me = this,
                isPressed = me.isPressed(),
                xmlManager = FBEditor.view.panel.main.xml.Manager.getInstance();

            // включаем/отключаем перенос длинных строк
            xmlManager.lineWrap(isPressed);
        },

        /**
         * Нажата ли кнопка.
         * @return {Boolean}
         */
        isPressed: function ()
        {
            return this.pressed;
        }
    }
);