/**
 * Контроллер текстового поля для названия произведения.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.titleArt.TitleArtController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		alias: 'controller.form.desc.titleArt',

		/**
		 * Вызывается при изменении названия.
		 */
		onChangeTitle: function ()
		{
			var me = this,
				view = me.getView(),
				desc = view.getFormDesc();

			// меняем название в заголовке окна
            desc.setTitleApp();
		},

		/**
		 * Вызывается при установке фокуса.
		 */
		onFocusTitle: function ()
		{
			//
		},

		/**
		 * Вызывается при потери фокуса.
		 */
		onBlurTitle: function ()
		{
			//
		}
	}
);