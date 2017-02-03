/**
 * Контроллер контейнера формы свойств элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.desc.editor.ContainerController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.panel.props.desc.editor.container',

		onBeforeActivate: function ()
		{
			var me = this,
				view = me.getView(),
				editor;

			// приводим панель редактирования свойств к начальному состоянию

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
				panelProps = view.getPanelProps(),
				data,
				name,
				editor;
			
			if (!view.isVisible())
			{
				// показываем контейнер
				panelProps.fireEvent('showContainer', view);
			}

			// данные элемента
			data = elem.getData();

			if (data)
			{
				editor = view.editor;

				if (!editor || editor && editor.elementName !== data.elementName)
				{
					if (editor)
					{
						// удаляем старую панель редактирования
						view.remove(editor);
					}

					try
					{
						// добавляем новую панель редактирования
						name = data.elementName.replace(/-/, '');
						name = 'FBEditor.view.panel.main.props.desc.editor.' + name + '.Editor';
						editor = Ext.create(name, {elementName: data.elementName});
						view.add(editor);
					}
					catch (e)
					{
						editor = null;
					}
				}

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