/**
 * Правая основная панель.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.RightPanel',
	{
		extend: 'FBEditor.view.panel.main.AbstractPanel',
		width: '15%',
		region: 'east',
		collapsible: true,
		split: true,
		bodyPadding: 10,
        title: 'Правая панель',
        html: 'Содержимое правой панели'
    }
);