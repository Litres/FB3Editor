/**
 * Контроллер поля Название.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.publishInfo.title.TitleController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.publishInfo.title',

		onChange: function ()
		{
			var me = this,
				view = me.getView();

			if (view.getValue())
			{
				view.isChanged = true;
			}
		},

		onFocus: function ()
		{
			var me = this,
				view = me.getView();

			if (!view.isChanged && !view.getValue())
			{
				me.onCopyTitle();
			}
		},

		/**
		 * Копирует поле название произведения.
		 */
		onCopyTitle: function ()
		{
			var me = this,
				view = me.getView(),
				title;

			title = Ext.getCmp('form-desc-title').getMain().getValue();
			view.setValue(title);
			Ext.defer(
				function ()
				{
					view.focus(true);
				},
				1
			);
		}
	}
);