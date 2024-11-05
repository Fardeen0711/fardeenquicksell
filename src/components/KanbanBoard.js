import React, { useEffect, useState } from "react";
import axios from "axios";
import "./KanbanBoard.css";
import Navbar from "./Navbar";

import BacklogIcon from "../assets/Backlog.svg";
import TodoIcon from "../assets/To-do.svg";
import InProgressIcon from "../assets/in-progress.svg";
import DoneIcon from "../assets/Done.svg";
import CancelledIcon from "../assets/Cancelled.svg";

import NoPriorityIcon from "../assets/No-priority.svg";
import LowPriorityIcon from "../assets/Img - Low Priority.svg";
import MediumPriorityIcon from "../assets/Img - Medium Priority.svg";
import HighPriorityIcon from "../assets/Img - High Priority.svg";
import CriticalPriorityIcon from "../assets/SVG - Urgent Priority colour.svg";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState({});
  const [grouping, setGrouping] = useState(
    localStorage.getItem("grouping") || "Status"
  );
  const [ordering, setOrdering] = useState(
    localStorage.getItem("ordering") || "Priority"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        );
        console.log(response.data);
        setTickets(response.data.tickets || []);
        const userMap = {};
        response.data.users.forEach((user) => {
          userMap[user.id] = user.name;
        });
        setUsers(userMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("grouping", grouping);
    localStorage.setItem("ordering", ordering);
  }, [grouping, ordering]);

  const handleGroupingChange = (newGrouping) => {
    setGrouping(newGrouping);
  };

  const handleOrderingChange = (newOrdering) => {
    setOrdering(newOrdering);
  };

  const groupTickets = () => {
    const grouped = {};
    tickets.forEach((ticket) => {
      let key;
      if (grouping === "Status") {
        key = ticket.status || "Unassigned";
      } else if (grouping === "User") {
        key = users[ticket.userId] || "Unassigned";
      } else if (grouping === "Priority") {
        key =
          ["No priority", "Low", "Medium", "High", "Critical"][
            ticket.priority
          ] || "Unassigned";
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(ticket);
    });

    // Sort tickets within each group by ordering criteria
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => {
        if (ordering === "Priority") {
          return b.priority - a.priority; // Descending by priority
        } else if (ordering === "Title") {
          return a.title.localeCompare(b.title); // Alphabetical by title
        }
        return 0;
      });
    });

    return grouped;
  };

  const groupedTickets = groupTickets();

  // Define display keys for each grouping
  const allStatuses = ["Backlog", "Todo", "In progress", "Done", "Cancelled"];
  const allUsers = Object.values(users);
  const allPriorities = ["No priority", "Low", "Medium", "High", "Critical"];

  const displayKeys =
    grouping === "Status"
      ? allStatuses
      : grouping === "User"
      ? allUsers
      : allPriorities;

  const getColumnStatusIcon = (status) => {
    switch (status) {
      case "Backlog":
        return <img src={BacklogIcon} alt="Backlog" />;
      case "Todo":
        return <img src={TodoIcon} alt="Todo" />;
      case "In progress":
        return <img src={InProgressIcon} alt="In progress" />;
      case "Done":
        return <img src={DoneIcon} alt="Done" />;
      case "Cancelled":
        return <img src={CancelledIcon} alt="Cancelled" />;
      default:
        return null;
    }
  };

  const getColumnPriorityIcon = (priority) => {
    switch (priority) {
      case 0:
        return <img src={NoPriorityIcon} alt="No priority" />;
      case 1:
        return <img src={LowPriorityIcon} alt="Low" />;
      case 2:
        return <img src={MediumPriorityIcon} alt="Medium" />;
      case 3:
        return <img src={HighPriorityIcon} alt="High" />;
      case 4:
        return <img src={CriticalPriorityIcon} alt="Critical" />;
      default:
        return null;
    }
  };

  const getTicketStatusIcon = (status) => {
    switch (status) {
      case "Backlog":
        return <img src={BacklogIcon} alt="Backlog" />;
      case "Todo":
        return <img src={TodoIcon} alt="Todo" />;
      case "In progress":
        return <img src={InProgressIcon} alt="In progress" />;
      case "Done":
        return <img src={DoneIcon} alt="Done" />;
      case "Cancelled":
        return <img src={CancelledIcon} alt="Cancelled" />;
      default:
        return null;
    }
  };

  const getTicketPriorityIcon = (priority) => {
    switch (priority) {
      case 0:
        return <img src={NoPriorityIcon} alt="No priority" />;
      case 1:
        return <img src={LowPriorityIcon} alt="Low" />;
      case 2:
        return <img src={MediumPriorityIcon} alt="Medium" />;
      case 3:
        return <img src={HighPriorityIcon} alt="High" />;
      case 4:
        return <img src={CriticalPriorityIcon} alt="Critical" />;
      default:
        return null;
    }
  };

  return (
    <div className="kanban-board">
      <Navbar
        onGroupingChange={handleGroupingChange}
        onOrderingChange={handleOrderingChange}
        currentGrouping={grouping}
        currentOrdering={ordering}
      />
      <div className="kanban-columns">
        {displayKeys.map((key, index) => (
          <div key={index} className="column">
            <h3>
              {grouping === "Priority" &&
                getColumnPriorityIcon(allPriorities.indexOf(key))}
              {grouping === "Status" && getColumnStatusIcon(key)}
              {key} ({groupedTickets[key] ? groupedTickets[key].length : 0})
            </h3>
            {(groupedTickets[key] || []).map((ticket) => (
              <div key={ticket.id} className="ticket">
                <h4>
                  {grouping === "Status" || grouping === "Priority"
                    ? `${ticket.id}`
                    : `${ticket.id}`}
                </h4>
                <p>
                  {grouping === "Priority" ? null : getTicketPriorityIcon(ticket.priority)}
                  {grouping === "Status" || grouping === "User"
                    ? getTicketStatusIcon(ticket.status)
                    : null}
                  {ticket.title}
                </p>
                {(grouping === "User" ||
                  grouping === "Priority" ||
                  grouping === "Status") && (
                  <span className="tag">
                    {grouping !== "Priority" && getTicketPriorityIcon(ticket.priority)}
                    {ticket.tag}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
