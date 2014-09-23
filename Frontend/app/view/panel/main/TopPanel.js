/**
 * Верхняя основная панель.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.TopPanel',
	{
		extend: 'FBEditor.view.panel.main.AbstractPanel',
		height: 100,
		region: 'north',
		collapsible: true,
		split: true,
		bodyPadding: 10,
        title: 'Верхняя панель',
        html: 'Содержимое верхней панели'
    }
);