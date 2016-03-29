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
				subject = view.up('form-desc-subject');

			// останавливаем всплытие события, чтобы не допустить закрытия окна
			e.stopPropagation();

			if (FBEditor.accessHub)
			{
				// показываем дерево жанров
				subject.fireEvent('showSubjectTree');

				// показываем список тегов
				subject.fireEvent('showTag');
			}
		},

		/**
		 * Вызывается при изменение значения поля.
		 */
		onChange: function ()
		{
			var me = this,
				view = me.getView(),
				value = view.getValue(),
				subject = view.up('form-desc-subject'),
				subjectTree = view.getSubjectTree(),
				managerDesc = FBEditor.desc.Manager;

			if (!managerDesc.loadingProcess)
			{
				if (!subjectTree.isShow)
				{
					// открываем окно
					subjectTree.show();
				}

				// Фильтруем дерево жанров
				subjectTree.fireEvent('filter', value.trim());

				// показываем список тегов
				subject.fireEvent('showTag');
			}
		},

		/**
		 * Вызывается при потери фокуса полем.
		 */
		onBlur: function (field)
		{
			var me = this,
				view = me.getView(),
				val = view.getValue(),
				subject = view.ownerCt,
				nextSubject = subject.nextSibling(),
				prevSubject = subject.previousSibling(),
				subjectTree = subject.subjectTree,
				isShow = subjectTree && subjectTree.isShow,
				plugin;

			//console.log('nextSubject && prevSubject', subject, nextSubject, prevSubject);
			if (!nextSubject && prevSubject && !val && !isShow)
			{
				// удаляем поле, если оно последнее, пустое и список закрыт
				Ext.defer(
					function ()
					{
						// плагин
						plugin = subject.getPlugin('fieldcontainerreplicator');

						plugin.removeFields();
					},
				    100 // задержка удаления необходима, чтобы отработали другие методы фреймворка onBlur
				);
			}
			else
			{
				// разбиваем введенные через запятую значения на отдельные поля
				me.splitField(field);
			}
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