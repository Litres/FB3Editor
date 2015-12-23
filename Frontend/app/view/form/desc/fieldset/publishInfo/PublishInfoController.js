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

		resetFieldset:  function (data)
		{
			var me = this,
				view = me.getView(),
				title;

			// сбрасываем флаг изменения поля названия
			title = view.getPublishTitle();
			title.isChanged = false;

			me.callParent(arguments);
		},

		onExpand: function ()
		{
			var me = this,
				view = me.getView(),
				title;

			title = view.getPublishTitle();

			if (!title.isChanged && !title.getValue())
			{
				title.fireEvent('copyTitle');
			}
		}
	}
);