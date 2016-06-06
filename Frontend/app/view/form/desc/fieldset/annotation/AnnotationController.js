/**
 * Контроллер блока аннотации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.annotation.AnnotationController',
	{
		extend: 'FBEditor.view.form.desc.fieldset.AbstractFieldsetController',
		alias: 'controller.desc.fieldset.annotation',

		onCheckExpand: function ()
		{
			var me = this,
				view = me.getView(),
				editor;

			editor = view.items.first();

			if (editor.getValue())
			{
				view.expand();
			}
		}
	}
);