/**
 * Контроллер редактора html.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.htmleditor.HtmlEditorController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.htmleditor',

		onPaste: function (data)
		{
			var me = this,
				view = me.getView();

			view.cleanTags();
		},

		/**
		 * Вызывается при нажатии на кнопку "Уборка".
		 */
		onBeforeFieldCleaner: function ()
		{
			var me = this,
				view = me.getView(),
				val;

			// нормализуем значение
			view.normalizeValue();

			val = view.getValue();

			// объединяем короткие строки менее 49 символов
			val = val.replace(/-<br\/>/igm, '');
			val = val.replace(/^(.{0,49}?)<br\/>/igm, '$1 ');
			val = val.replace(/-<\/p><p>/ig, '');
			val = val.replace(/<p>(.{0,49}?)<\/p><p>/ig, '<p>$1');

			// объединяем строки заканчивающиеся не на знак припенания
			while (/^(.*?)[^.,!?]+<br\/>/igm.test(val))
			{
				val = val.replace(/^(.*?[^.,!?]+)<br\/>/igm, '$1 ');
			}

			while (/<p>(.*?)[^.,!?]+<\/p><p>/ig.test(val))
			{
				val = val.replace(/<p>(.*?[^.,!?]+)<\/p><p>/ig, '<p>$1 ');
			}

			view.setValue(val);
		},

		/**
		 * Вызывается при нажатии на кнопку "Уборка".
		 */
		onAfterFieldCleaner: function ()
		{
			var me = this,
				view = me.getView(),
				val = view.getValue();

		}
	}
);