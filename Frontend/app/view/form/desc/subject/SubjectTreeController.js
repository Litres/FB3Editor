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
		 * Вызывается при разворачивании узла.
		 * @param {Ext.data.NodeInterface} dataNode Узел.
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

			scrollTop = children > visibleNodes ? posY - marginTopHeight :
			            (posY + children * nodeHeight > scrollTop + height ?
			             scrollTop + hiddenChildrenHeight : scrollTop);

			//console.log(scrollTop);

			// корректируем скролл с развернутым узлом
			me.scrollTop = scrollTop;
			el.setScrollTop(scrollTop);
		},

		/**
		 * Вызывается при сворачивании узла.
		 * @param {Ext.data.NodeInterface} dataNode Узел.
		 */
		onNodeCollapse: function (dataNode)
		{
			var me = this,
				view = me.getView(),
				viewTable = view.getView(),
				el = viewTable.getEl();

			// восстанавливаем позицию скролла после закрытия узла дерева
			el.setScrollTop(view.scrollTop);
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
		 * @event selectSubject Выбрасывает событие по факту выбранного жанра.
		 * Вызывается при клике на одном из элементов узла дерева.
		 * @param {Ext.tree.View} node Узел дерева.
		 * @param {Ext.data.TreeModel} record Модель узла.
		 */
		onItemClick: function (node, record)
		{
			var me = this,
				view = me.getView(),
				subjectView,
				data;

			node.toggle(record);

			if (!record.isExpandable())
			{
				data = record.getData();
				subjectView = view.subjectView;
				subjectView.fireEvent('selectSubject', data);
				view.close();
			}
		},

		/**
		 * Позиционирует окно относительно поля ввода жанра.
		 */
		onAlignTo: function ()
		{
			var me = this,
				view = me.getView(),
				subject = view.subjectView,
				bodyHeight,
				height,
				posY;

			if (view.isVisible() && subject && view.rendered)
			{
				posY = subject.getY();
				height = view.getHeight() + 2;
				bodyHeight = Ext.getBody().getHeight();
				if (bodyHeight - posY < height)
				{
					view.alignTo(subject, 'tl', [0, -height]);
				}
				else
				{
					view.alignTo(subject, 'bl', [0, -10]);
				}
			}
		},

		/**
		 * Вызывается при изменении размеров окна.
		 */
		onResize: function ()
		{
			var me = this,
				view= me.getView();

			// предотвращаем скрытие окна
			view.isShow = false;
		}
	}
);