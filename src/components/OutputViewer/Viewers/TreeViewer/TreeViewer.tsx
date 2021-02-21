import React from 'react';
import * as d3 from 'd3';
import "./TreeViewer.scss";

interface TreeViewerProps {
  tree: any;
  rate: number;
}

let last = { k: 1, x: 0, y: 40 }

const drag_handler = d3.drag()
  .on("drag", function (event: any) {
    const boxLimit = 2000 * last.k;
    if (last.x < boxLimit && last.x > -boxLimit || (last.x >= boxLimit && event.dx < 0) || (last.x <= -boxLimit && event.dx > 0)) {
      last.x += event.dx
    }
    else {
      last.x = last.x > 0 ? boxLimit : -boxLimit;
    }
    if (last.y < boxLimit && last.y > -boxLimit || (last.y >= boxLimit && event.dy < 0) || (last.y <= -boxLimit && event.dy > 0)) {
      last.y += event.dy
    }
    else {
      last.y = last.y > 0 ? boxLimit : -boxLimit;
    }
    d3.select(this)
      .attr("transform",
        "translate(" + last.x + "," + last.y + ") scale(" + last.k + ")");
  });

const zoom_handler = d3.zoom()
  .on("zoom", function ({ transform }) {
    last.k = transform.k;
    d3.select(this)
      .attr("transform",
        "translate(" + last.x + "," + last.y + ") scale(" + last.k + ")");
  })

function TreeViewer(props: TreeViewerProps) {
  const refDiv = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    last = { k: 1, x: 0, y: 40 }
    const margin = { top: 40, right: 0, bottom: 0, left: 0 };
    const nodeData = d3.hierarchy(props.tree)
    const size = { x: nodeData.height * props.rate, y: nodeData.height * props.rate / 1.8 };
    const treemap = d3.tree().size([size.x, size.y])
    const nodes = treemap(nodeData);
    if (refDiv.current != null) {
      for (let i = 0; i < refDiv.current.children.length; i++) {
        refDiv.current.removeChild(refDiv.current.children[i])
      }
      let svg = d3.select(refDiv.current).append("svg").attr("width", "100%")
        .attr("height", "100%")
      let g = svg.append("g").attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
        .attr("cursor", "grab");

      g.append("rect")
        .attr("x", "-2000")
        .attr("y", "-2000")
        .attr("width", "5000")
        .attr("height", "5000")
        .attr("fill", "#fafafa")
        .attr("stroke", "black")

      g.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d => "M" + d.x + "," + d.y
          + "L" + d.parent!.x + "," + d.parent!.y);

      // adds each node as a group
      let node = g.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("class", function (d) {
          return "node" +
            (d.children ? " node--internal" : " node--leaf");
        })
        .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

      // adds the circle to the node
      node.append("circle")
        .attr("r", 12);

      // adds the text to the node
      node.append("text")
        .attr("dy", ".35em")
        .attr("y", d => d.children ? -20 : 20)
        .style("text-anchor", "middle")
        .text((d: any) => d.data.name);

      drag_handler(g as any);
      zoom_handler(g as any);

    }
  }
  )

  return (
    <div ref={refDiv} style={{ height: "100%" }}>

    </div>
  )

}

export default TreeViewer