/**
 * Контроллер текстового поля жанра.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.field.SubjectFieldController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.subject.field',

		/**
		 * Вызывается при клике по полю.
		 */
		onClick: function (e, input)
		{
			var me = this,
				view = me.getView(),
				subject = view.up('form-desc-subject'),
				subjectTree = subject.subjectTree;

			// останавливаем всплытие события, чтобы не допустить закрытия окна
			e.stopPropagation();

			// показываем дерево жанров
			subject.fireEvent('showSubjectTree');
		},

		/**
		 * Вызывается при изменение значения поля.
		 */
		onChange: function ()
		{
			var me = this,
				view = me.getView(),
				subject = view.up('form-desc-subject'),
				subjectTree = subject.subjectTree,
				value = view.getValue();

			if (!subjectTree.isShow)
			{
				// открываем окно
				subjectTree.show();
			}

			// Фильтруем дерево жанров
			subjectTree.fireEvent('filter', value.trim());
		}
	}
);