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
		 * Заполняет текстовое поле выбранным жанром из списка.
		 * @param {Object} data Данные жанра.
		 */
		onSelectSubject: function (data)
		{
			var me = this,
				view = me.getView(),
				subjectTree = view.getSubjectTree(),
				val,
				textfield,
				plugin,
				nextSubject;

			val = data[subjectTree.displayField];

			// вырезаем теги жирности
			val = val.replace(/<\/?b>/ig, '');

			textfield = view.down('textfield');
			textfield.setValue(val);
			textfield.setFieldLabel(view.translateText.subject);

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
		 * @param {Object} data Данные жанра.
		 */
		onSelectTag: function (data)
		{
			var me = this,
				view = me.getView(),
				tag = view.getTag(),
				val,
				textfield,
				plugin,
				nextSubject;

			val = data[tag.displayField];

			// вырезаем теги жирности
			val = val.replace(/<\/?b>/ig, '');

			textfield = view.down('textfield');
			textfield.setValue(val);
			textfield.setFieldLabel(view.translateText.tag);

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
		onShowSubjectTree: function ()
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
		onShowTag: function ()
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