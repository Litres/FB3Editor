/**
 * Кнопка вставки аннотации annotation.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.toolstab.main.button.annotation.Annotation',
	{
		extend: 'FBEditor.view.panel.toolstab.main.button.AbstractButton',
		id: 'panel-toolstab-main-button-annotation',
		xtype: 'panel-toolstab-main-button-annotation',
		//controller: 'panel.toolstab.main.button.annotation',
		html: '<i class="fa fa-font"></i>',
		tooltip: 'Аннотация',
		elementName: 'annotation'
	}
);