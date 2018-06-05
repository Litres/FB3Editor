/**
 * Контроллер панели свойств редактора текста книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.BodyController',
	{
		extend: 'Ext.app.ViewController',

		alias: 'controller.panel.props.body',

		onBeforeActivate: function ()
		{
			var me = this,
				view = me.getView(),
				propsInfo = view.getPropsInfo(),
				propsPath = view.getPropsPath(),
				editor,
				convertBtn,
				deleteBtn;

			// приводим панель редактирования к начальному состоянию

			propsInfo.update();
			propsPath.resetData();

			// кнопки
			convertBtn = view.getConvertBtn();
			deleteBtn = view.getDeleteBtn();
			convertBtn.setVisible(false);
			deleteBtn.setVisible(false);

			editor = view.editor;

			if (editor)
			{
				// удаляем старую панель редактирования
				view.remove(editor);
				view.editor = null;
			}
		},

		onAfterRender: function ()
		{
			var me = this,
				manager = FBEditor.getEditorManager(),
				el;

			// если есть активный элемент в тексте, то показываем его данные
			el = manager.getFocusElement();

			if (el)
			{
				me.onLoadData(el);
			}
		},

		/**
		 * Показывает свойства элемента редактора текста.
		 * @param {FBEditor.editor.element.AbstractElement} elem Элемент из которого будут получены все необходимые
		 * данные.
		 */
		onLoadData: function (elem)
		{
			var me = this,
				view = me.getView(),
				propsInfo = view.getPropsInfo(),
				propsPath = view.getPropsPath(),
				convertBtn = view.getConvertBtn(),
				deleteBtn = view.getDeleteBtn(),
				editor = view.editor,
				data,
				name,
				el;

			// данные элемента
			data = elem.getData();

			// ссылка на родительский элемент-контейнер, данные которого и будут отображены в панели
			el = data.el;

			if (data)
			{
				// обновляем инфу
				propsInfo.update(data);

                Ext.suspendLayouts();

				// устанавливаем путь
				propsPath.updateData(el);

				// кнопки
				convertBtn.element = el;
				deleteBtn.element = el;
				convertBtn.setVisible(true);
				deleteBtn.setVisible(true);

				if (el.isRoot)
				{
					deleteBtn.setVisible(false);
				}

				if (el.isImg || el.isRoot || !convertBtn.verify())
				{
					convertBtn.setVisible(false);
				}

				if (!editor || editor && !editor.element.equal(data.el))
				{
					if (editor)
					{
						// удаляем старую панель редактирования
						view.remove(editor);
					}

					try
					{
						// добавляем новую панель редактирования
						name = data.elementName.replace(/-/g, '');
						name = name.toLowerCase();
						name = 'FBEditor.view.panel.main.props.body.editor.' + name + '.Editor';
						editor = Ext.create(name, {elementName: data.elementName});
						view.add(editor);
					}
					catch (e)
					{
						editor = null;
					}
				}

                Ext.resumeLayouts();

				if (editor)
				{
					// обновляем даные панели редактирования
					editor.updateData(data, true);
				}

				view.editor = editor;
			}
		}
	}
);