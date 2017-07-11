/**
 * Контроллер окна жанров и тегов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.window.WindowController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.form.desc.subject.win',

		/**
		 * Позиционирует окно относительно поля ввода жанра.
		 */
		onAlignTo: function ()
		{
			var me = this,
				view = me.getView(),
				subject = view.getSubject(),
				subjectField,
				byX,
				byY,
				labelWidth;

			if (view.isVisible() && subject && view.rendered)
			{
				subjectField = subject.getSubjectField();
				labelWidth = 115; // ширина метки поля
				byX = 0;
				byY = -2;

				//console.log('align', [byX, byY], subjectField.inputEl);

				// выравниваем окно относительно поля
				view.alignTo(subjectField.inputEl, 'bl-tl', [byX, byY]);
			}
		},

		/**
		 * Вызывается при изменении размеров окна.
		 */
		onResize: function ()
		{
			var me = this,
				view = me.getView(),
				tag = view.getTag();

			// предотвращаем скрытие окна
			view.isShow = false;
			
			// обновляем размеры контейнера тегов
			tag.updateSize();
		}
	}
);