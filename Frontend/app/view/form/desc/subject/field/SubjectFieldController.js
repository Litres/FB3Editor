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
		},

		onBlur: function (field)
		{
			var me = this;

			// разбиваем введенные через запятую значения на отдельные поля
			me.splitField(field);
		},

		/**
		 * Разбивает введеные через запятую значения на отдельные поля.
		 * @param {Ext.form.field.Text} field Текстовое поле.
		 */
		splitField: function (field)
		{
			var me = this,
				view = me.getView(),
				val = field.getValue(),
				container,
				plugin,
				values,
				reg;

			// разбиваем строку на массив значений
			reg = new RegExp(view.separator + '[ ]*')
			values = val.split(reg);

			if (values.length > 1)
			{
				container = field.ownerCt;

				Ext.Array.each(
					values,
					function (item, index)
					{
						var f;

						// плагин
						plugin = container.getPlugin('fieldcontainerreplicator');

						// поле
						f = container.down('textfield');

						// устаналвиваем значение
						f.setValue(item);

						if (index + 1 < values.length)
						{
							// добавляем новый контейнер
							plugin.addFields();

							// ссылка на новый контейнер
							container = container.nextSibling();
						}
					}
				);
			}
		}
	}
);