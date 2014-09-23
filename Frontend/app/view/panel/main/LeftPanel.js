/**
 * Левая основная панель.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.LeftPanel',
    {
        extend: 'FBEditor.view.panel.main.AbstractPanel',
        width: '15%',
	    region: 'west',
	    collapsible: true,
	    split: true,
	    bodyPadding: 10,
        title: 'Левая панель',
        html: 'Содержимое левой панели'
    }
);