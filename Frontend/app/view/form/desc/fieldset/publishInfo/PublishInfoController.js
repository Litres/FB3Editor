/**
 * Контроллер блока бумажной публикации.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.fieldset.publishInfo.PublishInfoController',
	{
		extend: 'FBEditor.view.form.desc.fieldset.AbstractFieldsetController',
		alias: 'controller.desc.fieldset.publishInfo',

		onExpand: function ()
		{
			var me = this,
				view = me.getView(),
				title;

			title = view.down('form-desc-publishInfo-title');

			if (!title.isChanged && !title.getValue())
			{
				title.fireEvent('copyTitle');
			}
		}
	}
);