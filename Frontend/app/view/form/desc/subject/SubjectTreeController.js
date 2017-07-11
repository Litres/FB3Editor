/**
 * Контроллер панели дерева списка жанров.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.SubjectTreeController',
	{
		extend: 'Ext.app.ViewController',
		
		alias: 'controller.form.desc.subjectTree',

		/**
		 * Вызывается при необходимотси отфильтровать дерево.
		 * @param {String} value Значение для фильтрации.
		 */
		onFilter: function (value)
		{
			var me = this,
				view = me.getView();

			view.filterData(value);
		},

		/**
		 * Вызывается при клике на панели дерева.
		 * @param {Object} evt Объект события.
		 */
		onClick: function (evt)
		{
			// останавливаем всплытие события, чтобы не допустить закрытия окна
			evt.stopPropagation();
		},

		/**
		 * Вызывается при клике на одном из элементов узла дерева.
		 * @event selectSubject Выбрасывает событие по факту выбранного жанра.
		 * @param {Ext.tree.View} node Узел дерева.
		 * @param {Ext.data.TreeModel} record Модель узла.
		 */
		onItemClick: function (node, record)
		{
			var me = this,
				view = me.getView(),
				win = view.getWindow(),
				subject = win.getSubject(),
				data,
				val;

			node.toggle(record);

			if (!record.isExpandable())
			{
				data = record.getData();
				val = data[view.displayField];

				// вырезаем теги жирности
				val = val.replace(/<\/?b>/ig, '');

				subject.fireEvent('selectSubject', val);
				
				// закрываем окно
				win.close();
			}
		},

		/**
		 * Вызывается при разворачивании узла.
		 * @param {Ext.data.NodeInterface} dataNode Узел.
		 * @deprecated Больше не используется.
		 */
		onNodeExpand: function (dataNode)
		{
			var me = this,
				view = me.getView(),
				viewTable = view.getView(),
				el = viewTable.getEl(),
				scrollTop = view.scrollTop,
				height = view.getHeight(),
				nodeHeight = 24,
				visibleNodes,
				children,
				visibleChildrenHeight,
				hiddenChildrenHeight,
				marginTopHeight,
				node,
				posY;

			// узел html
			node = viewTable.getNode(dataNode);

			if (!node)
			{
				return;
			}

			// позиция узла
			posY = node.offsetTop;

			// количество дочерних узлов
			children = dataNode.childNodes.length;

			// максимальное количество видимых узлов в окне
			visibleNodes = Math.floor(height / nodeHeight) - 2;

			// высота видимой части дочерних узлов
			visibleChildrenHeight = scrollTop + height - posY;

			// высота скрытой части дочерних узлов
			hiddenChildrenHeight = children * nodeHeight - visibleChildrenHeight;

			// дополнительный отступ скролла сверху, чтобы прокручивать узел не к самой верхней части окна
			marginTopHeight = posY - scrollTop < nodeHeight ? 0 : nodeHeight;

			//console.log(children, scrollTop, posY, hiddenChildrenHeight, marginTopHeight);

			scrollTop = posY;
			/*scrollTop = children > visibleNodes ? posY - marginTopHeight :
			 (posY + children * nodeHeight > scrollTop + height ?
			 scrollTop + hiddenChildrenHeight : scrollTop);*/

			//console.log(scrollTop);

			// корректируем скролл с развернутым узлом
			me.scrollTop = scrollTop;
			el.setScrollTop(scrollTop);
		},

		/**
		 * Вызывается при сворачивании узла.
		 * @param {Ext.data.NodeInterface} dataNode Узел.
		 * @deprecated Больше не используется.
		 */
		onNodeCollapse: function (dataNode)
		{
			var me = this,
				view = me.getView(),
				viewTable = view.getView(),
				el = viewTable.getEl();

			// восстанавливаем позицию скролла после закрытия узла дерева
			el.setScrollTop(view.scrollTop);
		}
	}
);