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
				subject = view.getSubject();

			// останавливаем всплытие события, чтобы не допустить закрытия окна
			e.stopPropagation();

			if (FBEditor.accessHub)
			{
				// показываем окно
				subject.fireEvent('showWindow');
			}
		},

		/**
		 * Вызывается при изменение значения поля.
		 */
		onChange: function ()
		{
			var me = this,
				view = me.getView(),
				value = view.getValue().trim(),
				subject = view.getSubject(),
				win = subject.getWindow(),
				tree = win.getTree(),
				managerDesc = FBEditor.desc.Manager,
				fieldLabel;

			if (!managerDesc.loadingProcess)
			{
				// значение изменилось в результате ручного ввода
				// открываем окно
				win.show();
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
				else if (value)
				{
					// синхронизируем метку поля со значением (Тег или Жанр)
					fieldLabel = tree.existValue(value) ? 
					             subject.translateText.subject : subject.translateText.tag;
					
					view.setFieldLabel(fieldLabel);
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
				win = subject.getWindow(),
				nextSubject = subject.nextSibling(),
				prevSubject = subject.previousSibling(),
				isShow,
				plugin;

			// открыто ли окно
			isShow = win && win.isShow;

			//console.log('nextSubject && prevSubject', val, isShow, subject, nextSubject, prevSubject);

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