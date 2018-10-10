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
		 * Вызывается при изменение значения поля.
		 */
		onChange: function ()
		{
			var me = this,
				view = me.getView(),
				subject = view.getSubject(),
				managerDesc = FBEditor.desc.Manager;

			if (!managerDesc.loadingProcess)
			{
				// значение изменилось в результате ручного ввода
			}
			else
			{
				// значение изменилось в результате загрузки описания

				if (view.isEmptyValue())
				{
					// очищаем поле
					view.setRawValue('');
					view.setFieldLabel(subject.translateText.undefined);
				}
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
				subject = view.getSubject(),
				nextSubject = subject.nextSibling(),
				prevSubject = subject.previousSibling(),
				plugin;

			//console.log('nextSubject && prevSubject', val, subject, nextSubject, prevSubject);

			if (!nextSubject && prevSubject && !val)
			{
				// удаляем поле, если оно последнее и пустое
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
			reg = new RegExp(view.separator + '[ ]*');
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