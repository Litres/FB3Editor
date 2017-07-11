/**
 * Контроллер поля жанра.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.SubjectController',
	{
		extend: 'FBEditor.view.form.desc.AbstractFieldController',
		
		alias: 'controller.form.desc.subject',

		/**
		 * Показывает окно с жанрами и тегами.
		 */
		onShowWindow: function ()
		{
			var me = this,
				view = me.getView(),
				win = view.getWindow();

			// устанавливаем связь с полем
			win.setSubject(view);

			// показываем окно тегов
			win.show();
		},
		
		/**
		 * Заполняет текстовое поле выбранным жанром из списка.
		 * @param {String} val Данные жанра.
		 */
		onSelectSubject: function (val)
		{
			var me = this,
				view = me.getView(),
				subjectField = view.getSubjectField(),
				tt = view.translateText,
				plugin,
				nextSubject;

			subjectField.setValue(val);
			subjectField.setFieldLabel(tt.subject);

			// следующий жанр
			nextSubject = view.nextSibling();

			if (!nextSubject)
			{
				// добавляем новое поле жанра
				plugin = view.getPlugin('fieldcontainerreplicator');
				plugin.addFields();
			}
		},

		/**
		 * Заполняет текстовое поле выбранным тегом из списка.
		 * @param {String} val Данные тега.
		 */
		onSelectTag: function (val)
		{
			var me = this,
				view = me.getView(),
				subjectField = view.getSubjectField(),
				plugin,
				nextSubject;

			subjectField.setValue(val);
			subjectField.setFieldLabel(view.translateText.tag);

			// следующий жанр
			nextSubject = view.nextSibling();

			if (!nextSubject)
			{
				// добавляем новое поле жанра
				plugin = view.getPlugin('fieldcontainerreplicator');
				plugin.addFields();
			}
		},

		/**
		 * Показывает окно жанров.
		 */
		_onShowSubjectTree: function ()
		{
			var me = this,
				view = me.getView(),
				subjectTree = view.getSubjectTree();

			subjectTree.subjectField = view;

			// показываем окно жанров
			subjectTree.initData();
		},

		/**
		 * Показывает окно тегов.
		 */
		_onShowTag: function ()
		{
			var me = this,
				view = me.getView(),
				tag = view.getTag();

			// устанавливаем связь с полем
			tag.setSubjectField(view);

			// показываем окно тегов
			tag.showTags();
		}
	}
);